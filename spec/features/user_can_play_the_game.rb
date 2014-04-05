require 'spec_helper'

describe "user can start a game", :js => true do

  before :each do
    visit '/'
  end

  it "starts a new game" do
    click_button("Start")
    Capybara.default_wait_time = 3
    click_button("Pause")
    expect(".steps").to have_content "Steps: 1"
  end

end