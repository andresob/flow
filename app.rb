load 'partial.rb'

get '/' do
  haml :index,
  layout: :landpage
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
