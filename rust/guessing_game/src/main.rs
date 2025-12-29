fn print_labeled_measurement(value: i32, _unit_label: char) -> i32 {
    value
}

fn main() {
    let x = print_labeled_measurement(4, 'x');
    let y:i32  = {
        5
    };
    println!("{}、{}",x,y)
}