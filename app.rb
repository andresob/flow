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

get '/cartogram' do
  haml :cartogram
end

get '/heatmap' do
  haml :heatmap
end
