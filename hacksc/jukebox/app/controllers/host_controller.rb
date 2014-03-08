class HostController < ApplicationController
    def index
    end
    def create_event
        # Reading the required parameters
        @event_name = params[:name];
        @description = params[:desc];
        @location = params[:location];
        @event_id = Time.now.to_i;
        @host_id = Random.rand(1000); # Magic number here
        @list_of_songs = params[:list_of_songs];
        
        # Now creating events
        @event = Event.create(:event_id => @event_id, 
                              :description => @description,
                              :host_id => @host_id,
                              :name => @event_name,
                              :location => @location);
        
        # Now creating songs
        base_songs_id = 0;
        @list_of_songs.each { |song|
            Songs.create(:song_id => base_songs_id,
                         :rating => 0,
                         :likes => 0,
                         :song_name => song,
                         :event_id => @event.id);
            base_songd_id += 1;
        }
        @json_response = { "event_id" => @event_id,
                           "host_id" => @host_id };
        render :json => @json_page
    end
    
    def get_event
        @event_id = params[:event_id];
        # Try
        @event = Event.find_by(:event_id => @event_id);
        @songs = Song.where(:event_id => @event.id);
        result_hash = { :name => @event.name,
                        :desc => @event.description,
                        :location => @event.location,
        };
        songs_list = [];
        recommedation_list = [];
        queued = [];
        @songs.each do |song|
            songs_list.append({name => song.name,
                               song_id => song.song_id,
                               likes => song.likes,
                               rating => song.rating});
            if song.queued
                queued.append(song_id);
            elsif song.rating > 0
                recommedation_list.append(song_id);
            end
        end
        result_hash["songs"] = songs_list;
        result_hash["recommedation_list"] = recommedation_list;
        result_hash["queued"] = queued;
        render :json => result_hash
    end

    def add_to_queue
        @event_id = params[:event_id];
        @host_id = params[:host_id];
        @song_id = params[:song_id];
        @event = Event.where(:event_id => @event_id,
                             :host_id => @host_id);
        @result = {};
        if @event.empty?
            @result["error_code"] = "CrapRightNow";
            @result["message"] = "event_id and host_id not mataching";
        else
            @song = Song.find(:event_id => @event.id, :song_id => @song_id);
            if @songs.blank?
                @result["error_code"] = "CrapRightNow";
                @result["message"] = "event_id and host_id not mataching";
            else
               @song.queued = True; 
               @result["success"] = ":-)";
            end
        end
        render :json => @result;
    end

    def get_recommendations
        @event_id = params[:event_id];
        @host_id = params[:host_id];
        # Try
        @event = Event.find_by(:event_id => @event_id);
        @songs = Song.where(:event_id => @event.id);
        recommedation_list = [];
        @songs.each do |song|
            if not song.queued && song.rating > 0
                recommedation_list.append(song_id);
            end
        end
        render :json => {"recommendation_list" => recommendation_list};
    end
end
