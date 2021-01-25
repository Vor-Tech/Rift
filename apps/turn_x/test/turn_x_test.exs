defmodule TurnXTest do
  use ExUnit.Case

  test "ports are working" do
    port = Port.open({:spawn, Path.join([:code.priv_dir(:turn_x), "turnx_vpx"])}, [:binary])
    Port.command(port, "hello Erlang")
    Port.close(port)
  end
end
