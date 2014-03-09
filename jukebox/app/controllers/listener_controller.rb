class ListenerController < ApplicationController
    def index
    end
    def get_event
        @event_id = params[:event_id];
        # Try
        @event = Event.find_by_event_id(@event_id);
        if @event.blank?
            @result = {};
            @result["error_code"] = "CrapRightNow";
            @result["message"] = "Invalid event_id";
            render :json => result and return
        end
        @songs = @event.songs;
        result_hash = { :name => @event.name,
                        :desc => @event.description,
                        :location => @event.location,
        };
        songs_list = [];
        recommedation_list = [];
        queued = [];
        @songs.each do |song|
            songs_list.append({:name => song.song_name,
                               :song_id => song.song_id,
                               :likes => song.likes,
                               :rating => song.rating});
            if song.queued
                queued.append(song.song_id);
            elsif song.rating.to_i > 0
                recommedation_list.append(song.song_id);
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
        @event = Event.where(:event_id => @event_id).first;
        @result = {};
        if @event.blank?
            @result["error_code"] = "CrapRightNow";
            @result["message"] = "event_id is not valid";
        else
            @song = @event.songs.where(:song_id => @song_id).first;
            if @song.blank?
                @result["error_code"] = "CrapRightNow";
                @result["message"] = "No song buddy";
            elsif @song.queued
                @result["error_code"] = "CrapRightNow";
                @result["message"] = "Cant recommend a queued song";
            else
                @song.update_attributes(:rating => @song.rating+1);
                @result["success"] = ":-)";
            end
        end
        render :json => @result;
    end
    
    def like_song
        @song_id = params[:song_id];
        @event_id = params[:event_id];
        @event = Event.where(:event_id => @event_id).first;
        @result = {};
        if @event.blank?
            @result["error_code"] = "CrapRightNow";
            @result["message"] = "event_id is not valid";
        else
            @song = @event.songs.where(:song_id => @song_id).first;
            if @song.blank?
                @result["error_code"] = "CrapRightNow";
                @result["message"] = "No song buddy";
            else
                @song.update_attributes(:likes => @song.likes+1);
                @result["success"] = ":-)";
            end
        end
        render :json => @result;
    end
    
    def get_recommendations
        @event_id = params[:event_id];
        # Try
        @event = Event.find_by_event_id(:event_id => @event_id);
        @result = {};
        if @event.empty?
            @result["error_code"] = "CrapRightNow";
            @result["message"] = "event_id and host_id not mataching";
        else
            @songs = @event.songs;
            recommendation_list = [];
            @songs.each do |song|
                if (not song.queued)&& song.rating > 0
                    recommendation_list.append(song.song_id);
                end
            end
            @result =  {"recommendation_list" => recommendation_list};
        end
        render :json => @result;
    end

    def get_queued
        @event_id = params[:event_id];
        # Try
        @event = Event.find_by_event_id(:event_id => @event_id);
        @result = {};
        if @event.empty?
            @result["error_code"] = "CrapRightNow";
            @result["message"] = "event_id and host_id not mataching";
        else
            @songs = @event.songs;
            queued_list = [];
            @songs.each do |song|
                if song.queued
                    queued_list.append(song.song_id);
                end
            end
            @result =  {"queued_list" => recommendation_list};
        end
        render :json => @result;
    end
end
