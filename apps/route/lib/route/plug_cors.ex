defmodule Route.Plug.CORS do
  @moduledoc """
  CORS helpers (see WHATWG fetch specification)
  """
  use Plug.Builder

  # TODO: add CORS preflight capabilities

  # defp send_success(conn) when conn.state != :sent do
  #   conn
  #   |> put_resp_header("access-control-allow-methods", conn.assigns.cors_method)
  #   |> send_resp(204, "")
  # end

  # defp send_success(conn), do: conn

  defp send_failure(conn) do
    conn |> send_resp(403, "403 Forbidden\r\n")
  end

  defp check_url(_, []), do: false

  defp check_url(code_origin, [conn_origin]) do
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

  defp handle_origin(conn, origin) do
    case origin do
      "*" ->
        # Wildcard
        conn |> assign(:cors_origin, "*")

      _ ->
        # We actually have a connection origin to enforce
        conn_origin = conn |> get_req_header("origin")

        cond do
          check_url(origin, conn_origin) ->
            conn
            |> assign(:cors_origin, origin)
            |> put_resp_header("access-control-allow-origin", origin)

          true ->
            conn |> send_failure
        end
    end
  end

  def init(opts) do
    Keyword.merge([origin: "*"], opts)
  end

  def call(conn, opts) do
    conn |> handle_origin(opts[:origin])
  end
end
