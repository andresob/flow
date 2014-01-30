require 'sinatra'
require 'haml'
require 'shotgun'

get '/' do
  haml :index
end
