require 'spec_helper'

describe "user can sign up" do

  it "lets a user create an account" do
    visit root_path
    click_link "Sign Up"
    fill_in "Email", with: "person@example.com"
    fill_in "Password", with: "password"
    fill_in "Password confirmation", with: "password"
    click_button "Sign Up"
    expect(page).to have_content "Conway's"
    expect(page).to have_content "Log Out"
  end

end