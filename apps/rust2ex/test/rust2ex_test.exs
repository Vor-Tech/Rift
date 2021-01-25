defmodule Rust2exTest do
  use ExUnit.Case
  doctest Rust2ex

  test "greets the world" do
    assert Rust2ex.hello() == :world
  end
end
