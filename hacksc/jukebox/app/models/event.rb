class Event < ActiveRecord::Base
  attr_accessible :description, :event_id, :host_id, :location, :name
end
