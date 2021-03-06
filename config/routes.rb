Conway::Application.routes.draw do
  
  root 'welcome#index'

  resources :users, except: [:index]

  get "/login", to: "session#new"
  post "/session", to: "session#create"
  delete "/session", to: "session#destroy"

end
