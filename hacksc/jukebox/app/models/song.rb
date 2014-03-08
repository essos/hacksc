class Song < ActiveRecord::Base
  belongs_to :event
  attr_accessible :likes, :rating, :song_id, :song_name
end
