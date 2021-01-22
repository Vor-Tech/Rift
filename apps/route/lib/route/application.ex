defmodule Route.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    port = Application.get_env(:rift, :port, 5000)

    children = [
      # Starts a worker by calling: Route.Worker.start_link(arg)
      # {Route.Worker, arg}
      {Plug.Cowboy, scheme: :http, plug: Route.Plug, options: [port: port]}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Route.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
