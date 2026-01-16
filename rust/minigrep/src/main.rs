#![allow(dead_code)]
#![allow(unused)]

use minigrep::Config;
use std::env;
use std::process;
use std::thread;

#[allow(unused)]
fn main() {
    // let args: Vec<String> = env::args().collect();
    // #[allow(unused_variables)]
    // let config = Config::build(&args).unwrap_or_else(|err| {
    //     eprintln!("Problem parsing arguments: {err}");
    //     process::exit(1);
    // });
    // if let Err(e) = minigrep::run(config) {
    //     eprintln!("Application error: {e}");
    //     process::exit(1);
    // }

    let b = Box::new(5);
}

struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}
