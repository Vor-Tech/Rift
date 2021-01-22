defmodule Route.Plug do
  @moduledoc """
  Main request router

  This path is fired on `/`, which fires one of a few sub-routes:
  - Users at `/users`
  - Bots at `/bots`
  - Channels at `/channels`
  - Guilds at `/guilds`
  """
  use Plug.Router
  alias Route.Plug.Users

  plug(:match)
  plug(:dispatch)

  # CORS preflight success because no failure message was sent
  defp cors_send_success(conn) when conn.state != :sent do
    conn
    |> put_resp_header("access-control-allow-origin", conn.assigns.cors_origin)
    |> put_resp_header("access-control-allow-methods", conn.assigns.cors_method)
    |> send_resp(204, "")
  end

  # Presumably failure in preflight, after we sent the 403
  defp cors_send_success(conn), do: conn

  # Don't send CORS information on a failure, per specs
  defp cors_send_failure(conn) do
    conn |> send_resp(403, "403 Forbidden\r\n")
  end

  # No origin specified by client when CORS is enforcing it to be there. No go.
  defp cors_check_url(_, []), do: false

  # Connection origin is in a list by default. Try to get it out.
  defp cors_check_url(code_origin, [conn_origin]) do
    conn_origin_uri = URI.parse(conn_origin)
    code_origin_uri = URI.parse(code_origin)

    %URI{
      scheme: code_origin_uri.scheme,
      host: code_origin_uri.host,
      port: code_origin_uri.port
    } == %URI{
      scheme: conn_origin_uri.scheme,
      host: conn_origin_uri.host,
      port: conn_origin_uri.port
    }
  end

  defp cors_check_origin(conn, origin) do
    case origin do
      "*" ->
        # Wildcard
        conn |> assign(:cors_origin, "*")

      _ ->
        # We actually have a connection origin to enforce
        conn_origin = conn |> get_req_header("origin")

        cond do
          cors_check_url(origin, conn_origin) ->
            conn |> assign(:cors_origin, origin)

          true ->
            conn |> cors_send_failure
        end
    end
  end

  defp cors_check_method(conn, methods) do
    cors_method = conn |> get_req_header("access-control-request-method")

    cond do
      Enum.any?(methods, fn method -> cors_method == [method] end) ->
        conn |> assign(:cors_method, methods |> Enum.join(","))

      true ->
        conn |> cors_send_failure
    end
  end

  # Main CORS endpoint. TODO: Storage of CORS preflight state.
  options "/*_cors" do
    conn
    |> cors_check_origin("*")
    |> cors_check_method(["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"])
    |> cors_send_success
  end

  forward("/users", to: Users)

  match _ do
    conn |> send_resp(404, "404 Not Found\r\n")
  end
end
