use rustler::{Encoder, Env, Error, Term, ResourceArc};
use std::cmp::Ordering;
use std::sync::mpsc::*;
mod turnx_vpx;

mod atoms {
    rustler::rustler_atoms! {
        atom ok;
        atom error;
        atom no_session;
        //atom __true__ = "true";
        //atom __false__ = "false";
    }
}

rustler::rustler_export_nifs! {
    "Elixir.TurnX",
    [
        // COMPANSION - compress then expand a VP8/VP9 stream
        // TODO: Protect user + anonymity/etc server-side w/SGX? Is this good?
        ("nif_create_session", 0, nif_insert_session),
        ("nif_insert_session", 1, nif_insert_session),
        ("nif_transmit", 2, nif_transmit),
        ("nif_receive", 2, nif_receive),
        ("nif_remove_session", 2, nif_remove_session)
    ],
    Some(on_load)
}

struct VpxResource {
    tx: SyncSender<VpxMsg>,
    rx: Receiver<VpxMsg>
}

enum VpxMsgTypes {
    Create,
    VFrame,
    Destroy
}

struct VpxMsg {
    mtype: VpxMsgTypes,
    mdata: Option<Vec<u8>>,
}

fn on_load(env: Env, _info: Term) -> bool {
    rustler::resource_struct_init!(VpxResource, env);
    true
}

// ============================================================================
//  Compander High Level Calls
// ============================================================================
fn nif_create_session<'a>(env: Env<'a>, args: &[Term<'a>]) -> Result<Term<'a>, Error> {
    let (tx_to_vpx, rx_from_vpx) = sync_channel::<VpxMsg>(0);
    let (rx_to_vpx, tx_from_vpx) = sync_channel::<VpxMsg>(0);

    let reference = ResourceArc::new(VpxResource {
        tx: tx_to_vpx.clone(),
        rx: tx_from_vpx,
    });
    std::thread::spawn(move || {
        let a: Vec<[turnx_vpx::compand::Compander; 2]> = vec![];
        let tx = tx_from_vpx;
        let rx = rx_to_vpx;
        // WIP
    });
    Ok((atoms::ok(), reference).encode(env))
}
fn nif_insert_session<'a>(env: Env<'a>, args: &[Term<'a>]) -> Result<Term<'a>, Error> {
    let vpx = 
    let size: usize = {
        let lock = companders_storage.lock().unwrap();
        let s = lock.len();
        unsafe {
            lock.push([turnx_vpx::compand::Compander::new(); 2]);
        }
        s
    };

    Ok((atoms::ok(), size).encode(env))
}

fn nif_remove_session<'a>(env: Env<'a>, args: &[Term<'a>]) -> Result<Term<'a>, Error> {
    let index: usize = args[0].decode()?;
    {
        let lock = companders_storage.lock().unwrap();
        match lock.len().cmp(&index) {
            Ordering::Greater => {
                lock.remove(index);
                Ok((atoms::ok()).encode(env))
            }
            _ => Ok((atoms::error(), atoms::no_session()).encode(env)),
        }
    }
}

fn nif_transmit<'a>(env: Env<'a>, ars: &[Term<'a>]) -> Result<Term<'a>, Error> {
    Ok((atoms::ok()).encode(env))
}

fn nif_receive<'a>(env: Env<'a>, args: &[Term<'a>]) -> Result<Term<'a>, Error> {
    Ok((atoms::ok()).encode(env))
}
