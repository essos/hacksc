class AddQueuedToSong < ActiveRecord::Migration
  def change
    add_column :songs, :queued, :boolean, :default => true
  end
end
