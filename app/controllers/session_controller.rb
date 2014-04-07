class SessionController < ApplicationController

  def new
  end

  def create
    user = User.find_by(email: params[:email])

    if user.nil?
      flash[:error] = "Sorry, we can't find that email address"
      render :new
    elsif user.authenticate(params[:password])
      session[:user_id] = user.id
      redirect_to root_path
    else
      flash[:error] = "Sorry, that's not the correct password"
      render :new
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_path
  end

end