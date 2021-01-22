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

  forward "/users", to: Users

  match _ do
    conn |> send_resp(404, "Not Found")
  end
end
