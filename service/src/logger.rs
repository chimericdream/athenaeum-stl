use log::LevelFilter;
use log4rs::append::console::ConsoleAppender;
use log4rs::append::rolling_file::RollingFileAppender;
use log4rs::append::rolling_file::policy::compound::CompoundPolicy;
use log4rs::append::rolling_file::policy::compound::trigger::size::SizeTrigger;
use log4rs::encode::pattern::PatternEncoder;
use log4rs::config::{Appender, Config, Root};
use crate::util::get_exe_dir;

pub fn init() -> Result<(), Box<dyn std::error::Error>> {
    let mut log_dir = get_exe_dir().unwrap();
    log_dir.push("logs");
    log_dir.push("output.log");

    let pattern = "[{d(%Y-%m-%d %H:%M:%S)}][{T:<12.12}][{l:<5.5}] {m}\n";
    let logfile = RollingFileAppender::builder()
        .encoder(Box::new(PatternEncoder::new(pattern)))
        .build(
            log_dir.to_str().unwrap(),
            Box::new(
                CompoundPolicy::new(
                    Box::new(SizeTrigger::new(1024 * 1024 * 10)),
                    Box::new(log4rs::append::rolling_file::policy::compound::roll::fixed_window::FixedWindowRoller::builder().build("log/output.log.{}", 10).unwrap())
                )
            )
        )?;
    let stdout = ConsoleAppender::builder()
        .encoder(Box::new(PatternEncoder::new(pattern)))
        .build();

    let config = Config::builder()
        .appender(Appender::builder().build("stdout", Box::new(stdout)))
        .appender(Appender::builder().build("logfile", Box::new(logfile)))
        .build(Root::builder()
            .appender("logfile")
            .appender("stdout")
            .build(LevelFilter::Info))?;

    log4rs::init_config(config)?;

    Ok(())
}
