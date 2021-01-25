defmodule TurnX.Native do
  @moduledoc """
  VP8/VP9 decoding/encoding NIFs for the TURN, what ought to be hardware
  accelerated by Rust and libvpx.
  """
  use Rustler, otp_app: :turn_x, crate: "turnx_nifs"

  @doc """
  Initialize a decoder/encoder dedicated to VP8/VP9 streaming for the TURN.

  Returns `{:ok, reference()}`.
  """
  @spec nif_initialize :: {:ok, reference()}
  def nif_initialize(), do: :erlang.nif_error(:nif_not_loaded)

  def nif_terminate(_handle), do: :erlang.nif_error(:nif_not_loaded)

  def nif_insert_session(_a), do: :erlang.nif_error(:nif_not_loaded)

  def nif_transmit(_a, _b), do: :erlang.nif_error(:nif_not_loaded)

  def nif_receive(_a, _b), do: :erlang.nif_error(:nif_not_loaded)

  def nif_remove_session(_a, _b), do: :erlang.nif_error(:nif_not_loaded)
end
