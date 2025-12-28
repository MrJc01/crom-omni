
fn get_available_port(start: u16) -> Option<u16> {
    (start..=9000).find(|port| std::net::TcpListener::bind(("127.0.0.1", *port)).is_ok())
}
