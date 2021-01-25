# Rust2ex
Compiles Rust packages in `native`, installs to `_build`.

## Uses
Particularly suited for Elixir-Rust ports.

## Installation
```elixir
  def project do
    [
      compilers: [:rust2ex] ++ Mix.compilers,
    ]
  end
```

Run `mix compile` then `mix compile.rust2ex`.
