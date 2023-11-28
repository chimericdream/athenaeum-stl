use log::LevelFilter;
use log4rs::append::rolling_file::RollingFileAppender;
use log4rs::append::rolling_file::policy::compound::CompoundPolicy;
use log4rs::append::rolling_file::policy::compound::trigger::size::SizeTrigger;
use log4rs::encode::pattern::PatternEncoder;
use log4rs::config::{Appender, Config, Root};

pub fn init() -> Result<(), Box<dyn std::error::Error>> {
    let logfile = RollingFileAppender::builder()
        .encoder(Box::new(PatternEncoder::new("{l} - {m}\n")))
        .build(
            "log/output.log",
            Box::new(
                CompoundPolicy::new(
                    Box::new(SizeTrigger::new(1024 * 1024 * 10)),
                    Box::new(log4rs::append::rolling_file::policy::compound::roll::fixed_window::FixedWindowRoller::builder().build("log/output.log.{}", 10).unwrap())
                )
            )
        )?;

    let config = Config::builder()
        .appender(Appender::builder().build("logfile", Box::new(logfile)))
        .build(Root::builder()
            .appender("logfile")
            .build(LevelFilter::Info))?;

    log4rs::init_config(config)?;

    Ok(())
}
