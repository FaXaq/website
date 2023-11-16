use wasm_bindgen::prelude::*;
use js_sys::*;
extern crate console_error_panic_hook;

#[path = "utils.rs"] mod utils;

// Extract functions from javascript
#[wasm_bindgen]
extern "C" {
    // console.log is polymorphic so we have to declare one for each type we need
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_usize(s: usize);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_f64(s: f64);
}

fn root_mean_square(vec: &Vec<f32>) -> f32 {
  let total_sum: f32 = vec.iter().sum();
  // casting is mandatory since rust only allows
  // operations between variables of the same type
  let vec_len: f32 = vec.len() as f32;
  (total_sum / vec_len).sqrt()
}

fn apply_buffer_threshold(vec: &Vec<f32>) -> Vec<f32> {
  let mut r1: usize = 0;
  let mut r2: usize = vec.len() - 1;
  let threshold: f32 = 0.2;

  for i in 0..vec.len()/2 {
    if vec[i].abs() < threshold {
      r1 = i;
      break;
    }
  }

  for i in 1..vec.len()/2 {
    let current_index:usize = vec.len() - i;
    if vec[current_index].abs() < threshold {
      r2 = current_index;
      break;
    }
  }

  // We need to create a new vector with the capacity required
  // before copying the slice into it
  let mut new_vec: Vec<f32> = Vec::with_capacity(r2 - r1);
  new_vec.extend_from_slice(&vec[r1..r2]);
  new_vec
}

#[wasm_bindgen]
pub fn auto_correlate(buffer: &Float32Array, sample_rate: i32) -> f32 {
  // This is to have rust errors showing up in console.
  utils::set_panic_hook();
  // Convert buffer to Vector
  let vec: Vec<f32> = buffer.to_vec();
  let rms: f32 = root_mean_square(&vec);

  if rms < 0.01 {
    -1 as f32
  } else {
    let new_buffer: Vec<f32> = apply_buffer_threshold(&vec);
    // create a correlation_array with the same size as the new_buffer
    let mut correlation_array: Vec<f32> = vec![0.0;new_buffer.len()];
    
    for i in 0..correlation_array.len() {
      // Here is a tweak to speed up rust. Do not access vector every iteration
      // create a variable and assign it at the vector index at the end
      let mut sum: f32 = 0.0;
      let item_correlation_len = correlation_array.len() - i;
      for j in 0..item_correlation_len {
        sum += new_buffer[j] * new_buffer[j+i];
      }
      correlation_array[i] = sum;
    }

    let mut d: usize = 0;

    while correlation_array[d] > correlation_array[d+1] {
      d += 1;
    }

    let mut max_val: f32 = -1.0;
    let mut max_pos: usize = usize::MIN;

    for i in d..new_buffer.len() {
      if correlation_array[i] > max_val {
        max_val = correlation_array[i];
        max_pos = i;
      }
    }

    sample_rate as f32 / max_pos as f32
  }
}

#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}