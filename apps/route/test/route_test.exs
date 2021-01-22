defmodule RouteTest do
  use ExUnit.Case
  doctest Route

  test "greets the world" do
    assert Route.hello() == :world
  end
end
