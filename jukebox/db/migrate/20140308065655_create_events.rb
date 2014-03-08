class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.integer :event_id
      t.integer :host_id
      t.string :name
      t.text :description
      t.text :location

      t.timestamps
    end
  end
end
