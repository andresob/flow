#!/usr/bin/env ruby
require 'csv'

file = ARGV[0]
destination = ARGV[1]
limit = ARGV[2]

matrix = CSV.parse open(file)

destino = matrix[0]

CSV.open( destination, "w") do |origem_destino|
	origem_destino << ["source", "target", "value"]
	matrix.each do |row|
		if row != destino
			origem = row[0]
			for i in 1..row.length()
				value = row[i]
				if value.to_i > limit.to_i and
					origem_destino << [origem, destino[i], value]
				end
			end
		end
	end
end	
