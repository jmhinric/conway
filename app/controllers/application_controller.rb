class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  def logged_in?
    current_user.present?
  end

  def authenticate
    unless logged_in?
      redirect_to login_path
    end
  end

  def authorize
    if current_user != @user && !logged_in?
      redirect_to login_path
    elsif current_user != @user
      flash[:notice] = "Authorization failed"
      redirect_to root_path
    end
  end


  helper_method :current_user, :logged_in?, :authenticate, :authorize

end
