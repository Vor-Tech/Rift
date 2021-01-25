use rustler::{Encoder, Env, Error, ResourceArc, Term};
use std::sync::mpsc::*;
use std::sync::Mutex;
use std::time::Duration;
mod turnx_vpx;

mod atoms {
    rustler::rustler_atoms! {
        atom ok;
        atom error;
        atom no_session;
        atom no_stream;
        //atom __true__ = "true";
        //atom __false__ = "false";
    }
}

rustler::rustler_export_nifs! {
    "Elixir.TurnX.Native",
    [
        // COMPANSION - compress then expand a VP8/VP9 stream
        // TODO: Protect user + anonymity/etc server-side w/SGX? Is this good?
        ("nif_initialize", 0, nif_initialize),
        ("nif_terminate", 1, nif_terminate),
        ("nif_insert_session", 1, nif_insert_session),
        ("nif_transmit", 2, nif_transmit),
        ("nif_receive", 2, nif_receive),
        ("nif_remove_session", 2, nif_remove_session)
    ],
    Some(on_load)
}

struct VpxResource {
    tx: SyncSender<VpxMsg>,
    rx: Mutex<Receiver<VpxMsg>>,
}

enum VpxMsgTypes {
    Create,
    VCount,
    VFrame,
    Destroy,
    SInsert,
    SRemove,
    SError,
}

struct VpxMsg {
    mtype: VpxMsgTypes,
    mnumb: usize,
    mdata: Option<Vec<u8>>,
}

fn on_load(env: Env, _info: Term) -> bool {
    rustler::resource_struct_init!(VpxResource, env);
    true
}

// ============================================================================
//  Compander High Level Calls
// ============================================================================
fn nif_initialize<'a>(env: Env<'a>, args: &[Term<'a>]) -> Result<Term<'a>, Error> {
    let (from_vpx, to_ses) = sync_channel::<VpxMsg>(0);
    let (from_ses, to_vpx) = sync_channel::<VpxMsg>(0);

    let reference = ResourceArc::new(VpxResource {
        tx: from_ses.clone(),
        rx: Mutex::new(to_ses),
    });
    std::thread::spawn(move || {
        let mut a: Vec<[turnx_vpx::compand::Compander; 2]> = vec![];
        loop {
            let vpx_msg = to_vpx.recv_timeout(Duration::from_millis(1000));
            if let Ok(value) = vpx_msg {
                match value.mtype {
                    VpxMsgTypes::Create => unsafe {
                        println!("creating");
                        a.push([
                            turnx_vpx::compand::Compander::new(),
                            turnx_vpx::compand::Compander::new(),
                        ]);
                        from_vpx
                            .send(VpxMsg {
                                mtype: VpxMsgTypes::Create,
                                mnumb: a.len(),
                                mdata: None,
                            })
                            .expect("can't send for creation, dropped")
                    },
                    VpxMsgTypes::Destroy => {
                        a.clear();
                        from_vpx
                            .send(VpxMsg {
                                mtype: VpxMsgTypes::Destroy,
                                mnumb: 0,
                                mdata: None,
                            })
                            .expect("can't send for destruction, dropped");
                        break;
                    }
                    _ => {}
                }
            }
        }

        println!("goodbye")
    });
    if let Ok(_) = reference.tx.send(VpxMsg {
        mtype: VpxMsgTypes::Create,
        mnumb: 0,
        mdata: None,
    }) {
        Ok((atoms::ok(), reference).encode(env))
    } else {
        Ok((atoms::error(), atoms::no_session()).encode(env))
    }
}

fn nif_terminate<'a>(env: Env<'a>, args: &[Term<'a>]) -> Result<Term<'a>, Error> {
    let reference: ResourceArc<VpxResource> = args[0].decode()?;
    {
        println!("dropping");
        reference
            .tx
            .send(VpxMsg {
                mtype: VpxMsgTypes::Destroy,
                mnumb: 0,
                mdata: None,
            })
            .expect("can't send for dropping");
        reference
            .rx
            .lock()
            .unwrap()
            .recv()
            .expect("can't recv for dropping");
    }
    Ok((atoms::ok()).encode(env))
}

fn nif_insert_session<'a>(env: Env<'a>, args: &[Term<'a>]) -> Result<Term<'a>, Error> {
    let vpx: ResourceArc<VpxResource> = args[0].decode()?;
    {
        if let Ok(_) = vpx.tx.send(VpxMsg {
            mtype: VpxMsgTypes::SInsert,
            mnumb: 0,
            mdata: None,
        }) {
            if let Ok(value) = vpx
                .clone()
                .rx
                .lock()
                .unwrap()
                .recv_timeout(Duration::from_millis(1000))
            {
                let st: VpxMsg = value;
                match st.mtype {
                    VpxMsgTypes::SError => {
                        Ok((atoms::error(), vpx.clone(), atoms::no_stream()).encode(env))
                    }
                    _ => Ok((atoms::ok(), vpx.clone(), st.mnumb).encode(env)),
                }
            } else {
                Ok((atoms::error(), vpx.clone(), atoms::no_session()).encode(env))
            }
        } else {
            Ok((atoms::error(), vpx.clone(), atoms::no_session()).encode(env))
        }
    }
}

fn nif_remove_session<'a>(env: Env<'a>, args: &[Term<'a>]) -> Result<Term<'a>, Error> {
    let vpx = args[0].decode::<ResourceArc<VpxResource>>()?;
    let slot: usize = args[1].decode()?;
    {
        if let Ok(_) = vpx.tx.send(VpxMsg {
            mtype: VpxMsgTypes::SRemove,
            mnumb: slot,
            mdata: None,
        }) {
            if let Ok(value) = vpx
                .clone()
                .rx
                .lock()
                .unwrap()
                .recv_timeout(Duration::from_millis(1000))
            {
                let st: VpxMsg = value;
                Ok((atoms::ok(), vpx, st.mnumb).encode(env))
            } else {
                Ok((atoms::error(), vpx, atoms::no_stream()).encode(env))
            }
        } else {
            Ok((atoms::error(), vpx, atoms::no_session()).encode(env))
        }
    }
}

fn nif_transmit<'a>(env: Env<'a>, args: &[Term<'a>]) -> Result<Term<'a>, Error> {
    Ok((atoms::ok()).encode(env))
}

fn nif_receive<'a>(env: Env<'a>, args: &[Term<'a>]) -> Result<Term<'a>, Error> {
    Ok((atoms::ok()).encode(env))
}
