class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.integer :song_id
      t.integer :rating
      t.integer :likes
      t.string :song_name
      t.references :event

      t.timestamps
    end
    add_index :songs, :event_id
  end
end
