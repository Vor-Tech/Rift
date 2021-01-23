use rustler::{Encoder, Env, Error, NifStruct, ResourceArc, Term};
mod turnx_vpx;

mod atoms {
    rustler::rustler_atoms! {
        atom ok;
        //atom error;
        //atom __true__ = "true";
        //atom __false__ = "false";
    }
}

rustler::rustler_export_nifs! {
    "Elixir.TurnX",
    [
        // COMPANSION - compress then expand a VP8/VP9 stream
        // TODO: Protect user + anonymity/etc server-side w/SGX? Is this good?
        ("nif_transmit", 2, nif_transmit),
        ("nif_receive", 2, nif_receive),
    ],
    Some(on_load)
}

struct TurnXRTCConnection {
    // VPX codec (VP8 or VP9)
    tx: turnx_vpx::compress::Compressor,
    rx: turnx_vpx::expand::Expander

    // SRTP context, will always be SRTCP and SRTP muxed
}

fn on_load(env: Env, _info: Term) -> bool {
    rustler::resource_struct_init!(TurnXRTCConnection, env);
    true
}

// ============================================================================
//  Compander High Level Calls
// ============================================================================
fn nif_transmit<'a>(env: Env<'a>, args: &[Term<'a>]) -> Result<Term<'a>, Error> {
    let rtc_conn: rustler::ResourceArc<TurnXRTCConnection> = args[0].decode()?;
    let data: Vec<u8> = vec![];

    Ok((atoms::ok(), rtc_conn, data).encode(env))
}

fn nif_receive<'a>(env: Env<'a>, args: &[Term<'a>]) -> Result<Term<'a>, Error> {
    let num1: i64 = args[0].decode()?;
    let num2: i64 = args[1].decode()?;

    Ok((atoms::ok(), num1 + num2).encode(env))
}
