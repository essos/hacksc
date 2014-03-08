class ListenerController < ApplicationController
    def index
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
    def recommend_song
        @song_id = params[:song_id];
        @event_id = params[:event_id];
        @event = Event.where(:event_id => @event_id);
        @result = {};
        if @event.empty?
            @result["error_code"] = "CrapRightNow";
            @result["message"] = "event_id is not valid";
        else
            @song = Song.where(:song_id => @song_id,
                               :event_id => @event_id);
            @song.rating += 1;
            @result["success"] = ":-)";
        end
        render :json => @result;
    end
    
    def like_song
        @song_id = params[:song_id];
        @event_id = params[:event_id];
        @event = Event.where(:event_id => @event_id);
        @result = {};
        if @event.empty?
            @result["error_code"] = "CrapRightNow";
            @result["message"] = "event_id is not valid";
        else
            @song = Song.where(:song_id => @song_id,
                               :event_id => @event_id);
            @song.likes += 1;
            @result["success"] = ":-)";
        end
        render :json => @result;
    end
end
