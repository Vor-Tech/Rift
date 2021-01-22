use rustler::{Encoder, Env, Error, NifStruct, ResourceArc, Term};

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
        ("nif_vpx_stream_init", 2, nif_vpx_stream_init),
        ("nif_vpx_transmit", 2, nif_vpx_transmit),
        ("nif_vpx_receive", 2, nif_vpx_receive),
        ("nif_vpx_stream_destroy", 2, nif_vpx_stream_destroy)
    ],
    Some(on_load)
}


fn on_load(env: Env, _info: Term) -> bool {
    unsafe { srtp2_sys::srtp_init(); }
    rustler::resource_struct_init!(TurnXRTCConnection, env);
    true
}

// ============================================================================
//  Compander Opaques
// ============================================================================
struct TurnXRTCConnection {
    codec: vpx_sys::vpx_codec_iface_t,
}

fn nif_vpx_stream_init<'a>(env: Env<'a>, args: &[Term<'a>]) -> Result<Term<'a>, Error> {
    let num1: i64 = args[0].decode()?;
    let num2: i64 = args[1].decode()?;

    Ok((atoms::ok(), num1 + num2).encode(env))
}

fn nif_vpx_stream_destroy<'a>(env: Env<'a>, args: &[Term<'a>]) -> Result<Term<'a>, Error> {
    let num1: i64 = args[0].decode()?;
    let num2: i64 = args[1].decode()?;

    Ok((atoms::ok(), num1 + num2).encode(env))
}
// ============================================================================
//  Compander NIFs and Structs
// ============================================================================
#[derive(NifStruct)]
#[module = "TurnX.SRTPFrame"]
struct TurnXSRTPFrame {
    pub coded: Vec<u8>,
}

fn nif_vpx_transmit<'a>(env: Env<'a>, args: &[Term<'a>]) -> Result<Term<'a>, Error> {
    let rtc_conn: rustler::ResourceArc<TurnXRTCConnection> = args[0].decode()?;
    let rtc_data: TurnXSRTPFrame = args[1].decode()?;

    rtc_data.coded;

    Ok((atoms::ok(), rtc_conn).encode(env))
}

fn nif_vpx_receive<'a>(env: Env<'a>, args: &[Term<'a>]) -> Result<Term<'a>, Error> {
    let num1: i64 = args[0].decode()?;
    let num2: i64 = args[1].decode()?;

    Ok((atoms::ok(), num1 + num2).encode(env))
}
