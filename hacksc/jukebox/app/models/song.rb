class Song < ActiveRecord::Base
  belongs_to :event
  attr_accessible :likes, :rating, :song_id, :song_name, :queued
  before_create :default_values
  private
  def default_values
      self.queued = false;
      true;
  end
end
