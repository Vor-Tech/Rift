// Compander: Compressor/Expander
// Compress because bandwidth is scarce
use vpx_sys;

// KILOBITS PER SECOND
pub const DEFAULT_BITRATE: u32 = 500_u32; // 500 kbps?
pub const DEADLINE_USECS: u64 = 10_000_u64; // 10 ms is acceptable

#[derive(Clone)]
pub struct Compander {
    bitrate: u32,
    fifo: Vec<Vec<u8>>,
    frame: vpx_sys::vpx_codec_pts_t,

    config: vpx_sys::vpx_codec_enc_cfg_t,
    encoder_codec: vpx_sys::vpx_codec_ctx_t,
    decoder_codec: vpx_sys::vpx_codec_ctx_t,
}

impl Compander {
    pub unsafe fn new() -> Compander {
        let iface_cx: *mut vpx_sys::vpx_codec_iface_t = vpx_sys::vpx_codec_vp9_cx();
        let iface_dx: *mut vpx_sys::vpx_codec_iface_t = vpx_sys::vpx_codec_vp9_dx();
        let mut codec_cx: vpx_sys::vpx_codec_ctx_t = std::mem::zeroed();
        let mut codec_dx: vpx_sys::vpx_codec_ctx_t = std::mem::zeroed();
        let config_cx: vpx_sys::vpx_codec_enc_cfg_t = std::mem::zeroed();
        let config_dx: vpx_sys::vpx_codec_dec_cfg_t = std::mem::zeroed();

        let cx_cfg_code = vpx_sys::vpx_codec_enc_config_default(iface_cx, &mut config_cx, 0);

        config_cx.rc_target_bitrate = DEFAULT_BITRATE;
        config_cx.g_error_resilient = 1;

        assert_eq!(cx_cfg_code, vpx_sys::VPX_CODEC_OK);

        let cx_code = vpx_sys::vpx_codec_enc_init_ver(
            &mut codec_cx,
            iface_cx,
            &config_cx,
            0,
            vpx_sys::VPX_ENCODER_ABI_VERSION as i32,
        );
        let dx_code = vpx_sys::vpx_codec_dec_init_ver(
            &mut codec_dx,
            iface_dx,
            &config_dx,
            0,
            vpx_sys::VPX_DECODER_ABI_VERSION as i32,
        );

        assert_eq!(cx_code, vpx_sys::VPX_CODEC_OK);
        assert_eq!(dx_code, vpx_sys::VPX_CODEC_OK);

        Compander {
            fifo: vec![],
            bitrate: DEFAULT_BITRATE,
            frame: 0,
            config: config_cx,
            encoder_codec: codec_cx,
            decoder_codec: codec_dx,
        }
    }

    pub unsafe fn set_bitrate(&mut self, rate: u32) {
        self.config.rc_target_bitrate = rate;
        let status = vpx_sys::vpx_codec_enc_config_set(&mut self.encoder_codec, &self.config);
        if status == vpx_sys::VPX_CODEC_OK {
            self.bitrate = rate
        }
    }
    pub fn get_bitrate(&self) -> u32 {
        self.bitrate
    }

    // push for reprocessing
    pub fn push(&mut self, frame: Vec<u8>) {
        self.fifo.push(frame)
    }
    // reprocess then pop
    pub unsafe fn pop(&mut self) -> Option<Vec<u8>> {
        let frame_to_reprocess = self.fifo.pop();

        match frame_to_reprocess {
            Some(frame_unwrapped) => {
                // Time to reprocess into the appropriate bitrate

                // DECODE
                vpx_sys::vpx_codec_decode(
                    &mut self.decoder_codec,
                    frame_unwrapped.as_ptr(),
                    frame_unwrapped.len() as u32,
                    std::ptr::null_mut(),
                    DEADLINE_USECS as i64,
                );

                let dx_image =
                    vpx_sys::vpx_codec_get_frame(&mut self.decoder_codec, std::ptr::null_mut());

                // Match it. Is it null? If so, encode.
                match Some(dx_image) {
                    Some(dx_valid_image) => {
                        // ENCODE
                        vpx_sys::vpx_codec_encode(
                            &mut self.encoder_codec,
                            &*dx_valid_image,
                            self.frame,
                            1,
                            0,
                            DEADLINE_USECS,
                        );
                    }
                    None => {
                        // FLUSH ENCODE
                        vpx_sys::vpx_codec_encode(
                            &mut self.encoder_codec,
                            std::ptr::null(),
                            self.frame,
                            1,
                            0,
                            DEADLINE_USECS,
                        );
                    }
                }
            }
            None => {
                // FLUSH ENCODE anyways
                vpx_sys::vpx_codec_encode(
                    &mut self.encoder_codec,
                    std::ptr::null(),
                    self.frame,
                    1,
                    0,
                    DEADLINE_USECS,
                );
            }
        }

        let reprocessed_frame =
            vpx_sys::vpx_codec_get_cx_data(&mut self.encoder_codec, std::ptr::null_mut());

        match Some(reprocessed_frame) {
            Some(valid_reprocessed) => Some(Vec::from_raw_parts(
                (*valid_reprocessed).data.frame.buf as *mut u8,
                (*valid_reprocessed).data.frame.sz as usize,
                (*valid_reprocessed).data.frame.sz as usize,
            )),
            None => None,
        }
    }

    // Report on congestion
    pub fn len(&mut self) -> usize {
        self.fifo.len()
    }
}

impl Drop for Compander {
    fn drop(&mut self) {
        unsafe {
            vpx_sys::vpx_codec_destroy(&mut self.encoder_codec);
            vpx_sys::vpx_codec_destroy(&mut self.decoder_codec);
        }
    }
}
