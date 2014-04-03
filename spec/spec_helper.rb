require 'rubygems'
require 'capybara'
require 'capybara/dsl'

Capybara.run_server = false
Capybara.current_driver = :selenium

Capybara.app_host = 'file://Users/johnhinrichs/dev/conway'

RSpec.configure do |config|
  config.include Capybara::DSL
end
