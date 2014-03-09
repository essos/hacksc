import sys
import os

def get_song_list_names(songs_file_name):
    sfh = open(songs_file_name, "r");
    song_list = [];
    for line in sfh:
        if line.strip() == "":
            continue;
        else:
            song_list.append(line.strip())
    return song_list;

def shellquote(s):
    return "'" + s.replace("'", "'\\''") + "'"

if __name__ == "__main__":
    mode = sys.argv[1];
    songs_file_name = sys.argv[2];
    songs_list = get_song_list_names(songs_file_name)
    # We have two modes Query mode and Web mode
    res = "";
    if mode.lower() == "query":
        base_url = "/host/create_query?name=test_name&desc=test_event&location=development_room";
        res += base_url;
        for song in songs_list:
            res += ("&song_list[]=" + song.strip())
        print res;
    elif mode.lower() =="web":
        touch_dir = sys.argv[3];
        for file_name in songs_list: 
            os.system("touch %s/%s"%(touch_dir, shellquote(file_name)));
    else:
        print "Please Provide a valid state";
