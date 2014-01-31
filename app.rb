require 'sinatra'
require 'haml'
require 'shotgun'
load 'partial.rb'

get '/' do
  haml :index
end

get '/maps' do
  haml :maps
end

get '/graphs' do
  haml :graphs
end

get '/about' do
  haml :about
end
