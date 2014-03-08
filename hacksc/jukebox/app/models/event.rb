class Event < ActiveRecord::Base
  has_many :songs, dependent: :destroy
  attr_accessible :description, :event_id, :host_id, :location, :name
end
