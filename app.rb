load 'partial.rb'

get '/' do
  haml :index
end

get '/graphs' do
  haml :graphs
end
