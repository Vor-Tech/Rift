use rustler::{Encoder, Env, Error, NifStruct, ResourceArc, Term};
use srtp2_sys;
use std::mem;
use vpx_sys;

enum TurnXSRTPTraits {
    ConfAndAuthGCM,
    ConfAndAuth,
    Conf,
    AuthGCM,
    Auth,
}

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
        ("nif_vpx_create", 2, nif_vpx_create),
        ("nif_vpx_transmit", 2, nif_vpx_transmit),
        ("nif_vpx_receive", 2, nif_vpx_receive),
    ],
    Some(on_load)
}

fn on_load(env: Env, _info: Term) -> bool {
    unsafe {
        srtp2_sys::srtp_init();
    }
    rustler::resource_struct_init!(TurnXRTCConnection, env);
    true
}

// ============================================================================
//  Compander Opaques
// ============================================================================
struct TurnXSRTPDuplex {
    policy: srtp2_sys::srtp_policy_t,
    session: srtp2_sys::srtp_t,
}
struct TurnXRTCConnection {
    // VPX codec (VP8 or VP9)
    // codec: vpx_sys::vpx_codec_iface_t,

    // SRTP context, will always be SRTCP and SRTP muxed
    srtp_tx: TurnXSRTPDuplex,
    srtp_rx: TurnXSRTPDuplex,
}

impl TurnXRTCConnection {
    unsafe fn new(crypto: TurnXSRTPTraits, key: Vec<u8>) -> TurnXRTCConnection {
        let rtc = TurnXRTCConnection {
            // A transmitter
            srtp_tx: TurnXSRTPDuplex {
                policy: mem::zeroed(),
                session: mem::zeroed(),
            },

            // A receiver
            srtp_rx: TurnXSRTPDuplex {
                policy: mem::zeroed(),
                session: mem::zeroed(),
            },
        };
        // GCM is Galois Counter Mode.
        match crypto {
            // Confidentiality and authenticity
            TurnXSRTPTraits::ConfAndAuthGCM => {}
            TurnXSRTPTraits::ConfAndAuth => match key.len() {
                // Note to self: https://en.wikipedia.org/wiki/Authenticated_encryption)
            }

            // Confidentiality
            TurnXSRTPTraits::Conf => match key.len() {
                // 128 => {
                //     srtp2_sys::srtp_crypto_policy_set_aes_cm_128_null_auth(
                //         &mut rtc.srtp_tx.policy.rtp,
                //     );
                //     srtp2_sys::srtp_crypto_policy_set_aes_cm_128_null_auth(
                //         &mut rtc.srtp_rx.policy.rtp,
                //     );
                //     srtp2_sys::srtp_crypto_policy_set_aes_cm_128_hmac_sha1_80(
                //         &mut rtc.srtp_tx.policy.rtcp,
                //     );
                //     srtp2_sys::srtp_crypto_policy_set_aes_cm_128_hmac_sha1_80(
                //         &mut rtc.srtp_rx.policy.rtcp,
                //     );
                // }
                192 => {
                    srtp2_sys::srtp_crypto_policy_set_aes_cm_192_null_auth(
                        &mut rtc.srtp_tx.policy.rtp,
                    );
                    srtp2_sys::srtp_crypto_policy_set_aes_cm_192_null_auth(
                        &mut rtc.srtp_rx.policy.rtp,
                    );
                    srtp2_sys::srtp_crypto_policy_set_aes_cm_192_hmac_sha1_80(
                        &mut rtc.srtp_tx.policy.rtcp,
                    );
                    srtp2_sys::srtp_crypto_policy_set_aes_cm_192_hmac_sha1_80(
                        &mut rtc.srtp_rx.policy.rtcp,
                    );
                }
                256 => {
                    srtp2_sys::srtp_crypto_policy_set_aes_cm_256_null_auth(
                        &mut rtc.srtp_tx.policy.rtp,
                    );
                    srtp2_sys::srtp_crypto_policy_set_aes_cm_256_null_auth(
                        &mut rtc.srtp_rx.policy.rtp,
                    );
                    srtp2_sys::srtp_crypto_policy_set_aes_cm_256_hmac_sha1_80(
                        &mut rtc.srtp_tx.policy.rtcp,
                    );
                    srtp2_sys::srtp_crypto_policy_set_aes_cm_256_hmac_sha1_80(
                        &mut rtc.srtp_rx.policy.rtcp,
                    );
                }
            },

            // Authenticity
            TurnXSRTPTraits::AuthGCM => match key.len() {
                128 => {
                    srtp2_sys::srtp_crypto_policy_set_aes_gcm_128_8_only_auth(
                        &mut rtc.srtp_tx.policy.rtp,
                    );
                    srtp2_sys::srtp_crypto_policy_set_aes_gcm_128_8_only_auth(
                        &mut rtc.srtp_rx.policy.rtp,
                    );
                    srtp2_sys::srtp_crypto_policy_set_aes_gcm_128_8_only_auth(
                        &mut rtc.srtp_tx.policy.rtcp,
                    );
                    srtp2_sys::srtp_crypto_policy_set_aes_gcm_128_8_only_auth(
                        &mut rtc.srtp_rx.policy.rtcp,
                    );
                }
                256 => {
                    srtp2_sys::srtp_crypto_policy_set_aes_gcm_256_8_only_auth(
                        &mut rtc.srtp_tx.policy.rtp,
                    );
                    srtp2_sys::srtp_crypto_policy_set_aes_gcm_256_8_only_auth(
                        &mut rtc.srtp_rx.policy.rtp,
                    );
                    srtp2_sys::srtp_crypto_policy_set_aes_gcm_256_8_only_auth(
                        &mut rtc.srtp_tx.policy.rtcp,
                    );
                    srtp2_sys::srtp_crypto_policy_set_aes_gcm_256_8_only_auth(
                        &mut rtc.srtp_rx.policy.rtcp,
                    );
                }
            },
            TurnXSRTPTraits::Auth => {
                srtp2_sys::srtp_crypto_policy_set_null_cipher_hmac_sha1_80(
                    &mut rtc.srtp_tx.policy.rtp,
                );
                srtp2_sys::srtp_crypto_policy_set_null_cipher_hmac_sha1_80(
                    &mut rtc.srtp_rx.policy.rtp,
                );
                srtp2_sys::srtp_crypto_policy_set_rtcp_default(&mut rtc.srtp_tx.policy.rtcp);
                srtp2_sys::srtp_crypto_policy_set_rtcp_default(&mut rtc.srtp_rx.policy.rtcp);
            }
        }

        rtc.srtp_tx.policy.ssrc.type_ = srtp2_sys::srtp_ssrc_type_t_ssrc_any_outbound;
        rtc.srtp_rx.policy.ssrc.type_ = srtp2_sys::srtp_ssrc_type_t_ssrc_any_inbound;

        rtc
    }
}
// impl Drop for TurnXRTCConnection {
//     fn drop(&mut self) {
//     }
// }

fn nif_vpx_create<'a>(env: Env<'a>, args: &[Term<'a>]) -> Result<Term<'a>, Error> {
    let rtc: ResourceArc<TurnXRTCConnection> = ResourceArc::new(TurnXRTCConnection::new());

    Ok((atoms::ok(), rtc).encode(env))
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
