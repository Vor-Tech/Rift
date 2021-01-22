defmodule Route.Plug.Users do
  @moduledoc """
  User request router
  """
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  post "/register" do
    conn |> send_resp(501, "501 Unimplemented\r\n")
  end

  post "/login" do
    conn |> send_resp(501, "501 Unimplemented\r\n")
  end

  delete "/delete" do
    conn |> send_resp(501, "501 Unimplemented\r\n")
  end

  post "/tokenValid" do
    conn |> send_resp(501, "501 Unimplemented\r\n")
  end

  post "/resToken" do
    conn |> send_resp(501, "501 Unimplemented\r\n")
  end

  post "/:sender/relationships/:recipient/pending" do
    conn |> send_resp(501, "501 Unimplemented\r\n")
  end

  delete "/:sender/relationships/:recipient/pending" do
    conn |> send_resp(501, "501 Unimplemented\r\n")
  end

  delete "/:sender/relationships/:recipient" do
    conn |> send_resp(501, "501 Unimplemented\r\n")
  end

  patch "/:sender/relationships/:recipient/block" do
    conn |> send_resp(501, "501 Unimplemented\r\n")
  end

  get "/" do
    conn |> send_resp(501, "501 Unimplemented\r\n")
  end

  match _ do
    conn |> send_resp(404, "404 Not Found\r\n")
  end
end
