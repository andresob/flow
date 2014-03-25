load 'partial.rb'

get '/' do
  haml :index
end

get '/graphs' do
  haml :graphs
end

get '/maps' do
  haml :maps
end

get '/deformed' do
  haml :deformed
end

get '/heatmap' do
  haml :heatmap
end
