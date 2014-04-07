require 'spec_helper'

describe User do
  before(:each) do
    User.create(
      email: "j@ex.co",
      password: "password",
      password_confirmation: "password")
  end

  it { should validate_uniqueness_of(:email) }
  it { should validate_presence_of(:email) }
end