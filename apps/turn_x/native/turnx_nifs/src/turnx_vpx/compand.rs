// Compander: Compressor/Expander
// Compress because bandwidth is scarce
use vpx_sys;

pub const MIN_BITRATE: u32 = 250_000_u32; // 250 kbps
pub const DEFAULT_BITRATE: u32 = 500_000_u32; // 500 kbps
pub const MAX_BITRATE: u32 = 1_500_000_u32; // 1.5 Mbps

pub struct Compander {
    bitrate: u32,
    encoder_codec: vpx_sys::vpx_codec_ctx_t,
    decoder_codec: vpx_sys::vpx_codec_ctx_t,
    fifo: Vec<Vec<u8>>,
}

impl Compander {
    pub fn encoder() -> Compander {
        unsafe { vpx_sys::vpx_codec_enc_init_ver() };
        Compander {
            fifo: vec![],
            bitrate: DEFAULT_BITRATE,
            encoder_context: 
        }
    }

    pub fn set_bitrate(&mut self, rate: u32) {
        self.bitrate = rate
    }
    pub fn get_bitrate(&self) -> u32 {
        self.bitrate
    }

    // push for reprocessing
    pub fn push(&mut self, frame: Vec<u8>) {
        self.fifo.push(frame)
    }

    // reprocess then pop
    pub fn pop(&mut self) -> Option<Vec<u8>> {
        let frame_to_reprocess = self.fifo.pop();

        match frame_to_reprocess {
            Some(frame_unwrapped) => {
                // Time to reprocess into the appropriate bitrate
            }
            None => None,
        }
    }

    // Report on congestion
    pub fn len(&mut self) -> usize {
        self.fifo.len()
    }
}

impl Drop for Compander {
    fn drop(&mut self) {}
}
