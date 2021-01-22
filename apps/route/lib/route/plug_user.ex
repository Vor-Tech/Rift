defmodule Route.Plug.Users do
  @moduledoc """
  User request router
  """
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  post "/register" do
    conn |> send_resp(501, "Unimplemented")
  end

  post "/login" do
    conn |> send_resp(501, "Unimplemented")
  end

  delete "/delete" do
    conn |> send_resp(501, "Unimplemented")
  end

  post "/tokenValid" do
    conn |> send_resp(501, "Unimplemented")
  end

  post "/resToken" do
    conn |> send_resp(501, "Unimplemented")
  end

  post "/:sender/relationships/:recipient/pending" do
    conn |> send_resp(501, "Unimplemented")
  end

  delete "/:sender/relationships/:recipient/pending" do
    conn |> send_resp(501, "Unimplemented")
  end

  delete "/:sender/relationships/:recipient" do
    conn |> send_resp(501, "Unimplemented")
  end

  patch "/:sender/relationships/:recipient/block" do
    conn |> send_resp(501, "Unimplemented")
  end

  get "/" do
    conn |> send_resp(501, "Unimplemented")
  end

  match _ do
    conn |> send_resp(404, "Not Found")
  end
end
