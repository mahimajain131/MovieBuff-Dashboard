import React, { useState, useEffect  } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, FlatList, Image, TouchableOpacity,Button } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const genreList = ['All', 'Action', 'Comedy', 'Drama'];
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('last7days');
  const [filteredData, setFilteredData] = useState([]);
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
      },
    ],
  };

  const pieData = [
    { name: 'Action', population: 21500000, color: '#FF6384', legendFontColor: '#fff', legendFontSize: 14 },
    { name: 'Comedy', population: 28000000, color: '#36A2EB', legendFontColor: '#fff', legendFontSize: 14 },
    { name: 'Drama', population: 52700000, color: '#FFCE56', legendFontColor: '#fff', legendFontSize: 14 },
  ];

  const filteredPieData = pieData.filter(item => selectedGenre === 'All' || item.name === selectedGenre);

  const recommendations = [
    { id: '1', title: 'Inception', poster: 'https://image.tmdb.org/t/p/original/xymM5aW6MDcH5AR9I3CamSegJd6.jpg', genre: 'Action' },
    { id: '2', title: 'The Dark Knight', poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', genre: 'Action' },
    { id: '3', title: 'Interstellar', poster: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg', genre: 'Drama' },
  ];

  const ratings = [
    { id: '1', title: 'Inception', rating: 4.5, poster: 'https://image.tmdb.org/t/p/original/xymM5aW6MDcH5AR9I3CamSegJd6.jpg', genre: 'Action' },
    { id: '2', title: 'The Dark Knight', rating: 5.0, poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', genre: 'Action' },
    { id: '3', title: 'Interstellar', rating: 4.0, poster: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg', genre: 'Drama' },
  ];

  const filteredRecommendations = recommendations.filter(item => selectedGenre === 'All' || item.genre === selectedGenre);
  const filteredRatings = ratings.filter(item => selectedGenre === 'All' || item.genre === selectedGenre);

  const activityTimeline = [
    { id: '1', title: 'Inception', date: '2024-08-01', poster: 'https://image.tmdb.org/t/p/original/xymM5aW6MDcH5AR9I3CamSegJd6.jpg' },
    { id: '2', title: 'The Dark Knight', date: '2024-08-05', poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
    { id: '3', title: 'Interstellar', date: '2024-08-10', poster: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg' },
  ];

  const interactions = [
    { id: '1', type: 'Likes', count: 120, icon: 'https://img.icons8.com/color/48/000000/facebook-like.png' },
    { id: '2', type: 'Dislikes', count: 15, icon: 'https://img.icons8.com/color/48/000000/thumbs-down.png' },
    { id: '3', type: 'Comments', count: 45, icon: 'https://img.icons8.com/color/48/000000/comments.png' },
    { id: '4', type: 'Replies', count: 30, icon: 'https://img.icons8.com/color/48/000000/reply-arrow.png' },
  ];

  const renderGenreButton = (genre) => (
    <TouchableOpacity
      key={genre}
      style={[styles.genreButton, selectedGenre === genre && styles.selectedGenreButton]}
      onPress={() => setSelectedGenre(genre)}
    >
      <Text style={styles.genreButtonText}>{genre}</Text>
    </TouchableOpacity>
  );

  const renderRecommendation = ({ item }) => (
    <TouchableOpacity style={styles.recommendationItem}>
      <Image
        source={{ uri: item.poster }}
        style={styles.poster}
        resizeMode="cover"
      />
      <Text style={styles.movieTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderRating = ({ item }) => (
    <TouchableOpacity style={styles.ratingItem}>
      <Image
        source={{ uri: item.poster }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.ratingDetails}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.rating}>Rating: {item.rating}/5</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTimelineItem = ({ item }) => (
    <TouchableOpacity style={styles.timelineItem}>
      <Image
        source={{ uri: item.poster }}
        style={styles.poster}
        resizeMode="cover"
      />
      <Text style={styles.movieTitle}>{item.title}</Text>
      <Text style={styles.dateText}>{item.date}</Text>
    </TouchableOpacity>
  );

  const renderInteractionItem = ({ item }) => (
    <TouchableOpacity style={styles.interactionItem}>
      <Image
        source={{ uri: item.icon }}
        style={styles.icon}
        resizeMode="contain"
      />
      <View style={styles.interactionDetails}>
        <Text style={styles.interactionType}>{item.type}</Text>
        <Text style={styles.interactionCount}>{item.count}</Text>
      </View>
    </TouchableOpacity>
  );
  const data = [
    // Your mock data structure for movies, genres, etc.
  ];

  useEffect(() => {
    filterDataByTimeFrame();
  }, [selectedTimeFrame]);

  const filterDataByTimeFrame = () => {
    const now = new Date();
    let filtered = [];

    switch (selectedTimeFrame) {
      case 'last7days':
        filtered = data.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= new Date(now.setDate(now.getDate() - 7));
        });
        break;
      case 'lastMonth':
        filtered = data.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getMonth() === now.getMonth() - 1;
        });
        break;
      case 'yearToDate':
        filtered = data.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getFullYear() === now.getFullYear();
        });
        break;
      default:
        filtered = data;
        break;
    }

    setFilteredData(filtered);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Movie Buff Dashboard</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, selectedTimeFrame === 'last7days' && styles.buttonActive]}
          onPress={() => setSelectedTimeFrame('last7days')}
        >
          <Text style={styles.buttonText}>Last 7 Days</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedTimeFrame === 'lastMonth' && styles.buttonActive]}
          onPress={() => setSelectedTimeFrame('lastMonth')}
        >
          <Text style={styles.buttonText}>Last Month</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedTimeFrame === 'yearToDate' && styles.buttonActive]}
          onPress={() => setSelectedTimeFrame('yearToDate')}
        >
          <Text style={styles.buttonText}>Year to Date</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dataContainer}>
        {filteredData.length > 0 ? (
          filteredData.map(item => (
            <View key={item.id} style={styles.dataItem}>
              <Text style={styles.dataTitle}>{item.title}</Text>
              <Text style={styles.dataDate}>{item.date}</Text>
              <Text style={styles.dataGenre}>{item.genre}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No data available for the selected time frame.</Text>
        )}
      </View>
    
      <View style={styles.genreSelector}>
        {genreList.map(renderGenreButton)}
      </View>
      <View style={styles.card}>
        <Text style={styles.subHeader}>Movies Watched Over Time</Text>
        <LineChart
          data={lineData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#121212',
            backgroundGradientTo: '#1E1E1E',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          style={styles.chart}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.subHeader}>Genre Preference</Text>
        <View style={styles.pieChartContainer}>
          <PieChart
            data={filteredPieData}
            width={screenWidth - 65}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="2"
            absolute
          />
        </View>
        <View style={styles.legendContainer}>
          {filteredPieData.map((item) => (
            <View key={item.name} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.subHeader}>Activity Timeline</Text>
        <FlatList
          data={activityTimeline}
          renderItem={renderTimelineItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timelineList}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.subHeader}>Ratings and Reviews</Text>
        <FlatList
          data={filteredRatings}
          renderItem={renderRating}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.ratingList}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.subHeader}>Top Recommendations</Text>
        <FlatList
          data={filteredRecommendations}
          renderItem={renderRecommendation}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recommendationList}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.subHeader}>Interactions</Text>
        <FlatList
          data={interactions}
          renderItem={renderInteractionItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.interactionList}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  genreSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  genreButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedGenreButton: {
    backgroundColor: '#ffa726',
  },
  genreButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  pieChartContainer: {
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    color: '#fff',
    fontSize: 14,
  },
  timelineList: {
    paddingVertical: 8,
  },
  timelineItem: {
    marginRight: 15,
    alignItems: 'center',
  },
  dateText: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  ratingList: {
    paddingVertical: 8,
  },
  ratingItem: {
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingDetails: {
    marginLeft: 10,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  rating: {
    color: '#fff',
    fontSize: 14,
  },
  interactionList: {
    paddingVertical: 8,
  },
  interactionItem: {
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionDetails: {
    marginLeft: 10,
  },
  interactionType: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  interactionCount: {
    color: '#888',
    fontSize: 12,
  },
  icon: {
    width: 40,
    height: 40,
  },
  recommendationList: {
    paddingVertical: 8,
  },
  recommendationItem: {
    marginRight: 15,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#ced4da',
  },
  buttonActive: {
    backgroundColor: 'orange',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dataContainer: {
    marginTop: 10,
  },
  dataItem: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
  },
  dataDate: {
    fontSize: 14,
    color: '#868e96',
    marginTop: 5,
  },
  dataGenre: {
    fontSize: 16,
    color: '#adb5bd',
    marginTop: 5,
  },
  noDataText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
   bottom:20
  },
});

export default DashboardScreen;
