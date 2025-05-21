import { useState, useEffect } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Filter, Search, SortDesc, Star, Video, BarChart4, UserCheck, Clock, AlertCircle, X, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserType, VerificationStatus } from "@/lib/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import TutorModal from "@/components/tutors/TutorModal";

// Types for the tutors data
interface Tutor {
  id: number;
  name: string;
  subjects: string[];
  rating: number;
  price: string;
  experience: number;
  image: string;
  description: string;
  languages: string[];
  classType: string[];
  availability: string[];
  qualifications: string[];
  demoVideo?: string;
}

// Empty tutors array - we'll fetch from the database
const tutorsData: Tutor[] = [];

// Function to fetch verified teachers from the database
const fetchVerifiedTeachers = async () => {
  try {
    console.log('Fetching verified teachers');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_type', 'teacher')
      .eq('verification_status', VerificationStatus.APPROVED);
      
    if (error) {
      console.error('Error fetching verified teachers:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} verified teachers`);
    
    // Transform the data into the Tutor format
    if (data) {
      return data.map(teacher => {
        // Safely access the video_url property with type checking
        const videoUrl = 'video_url' in teacher && typeof teacher.video_url === 'string' 
          ? teacher.video_url 
          : undefined;
          
        return {
          id: parseInt(teacher.id.substring(0, 8), 16), // Convert part of UUID to number for ID
          name: `${teacher.first_name} ${teacher.last_name}`,
          subjects: teacher.subject ? [teacher.subject] : [],
          rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5 and 5.0
          price: `₹3999`, // Fixed price in rupees
          experience: 1 + Math.floor(Math.random() * 10), // Random experience between 1-10 years
          image: teacher.avatar_url || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`, // Avatar or random placeholder
          description: teacher.bio || 'Experienced educator passionate about helping students succeed.',
          languages: ['English'], // Default
          classType: ['Academic'], // Default
          availability: ['Weekdays', 'Weekends'], // Default
          qualifications: ['Certified Teacher'], // Default
          demoVideo: videoUrl
        };
      });
    }
    
    return [];
  } catch (error) {
    console.error('Error in fetchVerifiedTeachers:', error);
    return [];
  }
};

const SearchPage = () => {
  const { user, profile } = useAuth();
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [subject, setSubject] = useState("all");
  const [language, setLanguage] = useState("all");
  const [classType, setClassType] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  
  // State for tutors from database
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for filtered tutors
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
  
  // State for selected tutor and modal
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter display state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Load verified teachers from database
  useEffect(() => {
    const loadTeachers = async () => {
      setLoading(true);
      const verifiedTeachers = await fetchVerifiedTeachers();
      setTutors(verifiedTeachers);
      setLoading(false);
    };
    
    loadTeachers();
  }, []);
  
  // Extract available filter options from tutors
  const subjects = [...new Set(tutors.flatMap(tutor => tutor.subjects))].sort();
  const languages = [...new Set(tutors.flatMap(tutor => tutor.languages))].sort();
  const classTypes = [...new Set(tutors.flatMap(tutor => tutor.classType))].sort();
  const availabilityOptions = [...new Set(tutors.flatMap(tutor => tutor.availability))].sort();

  // Effect for filtering and sorting tutors
  useEffect(() => {
    let result = [...tutors];
    
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        tutor => 
          tutor.name.toLowerCase().includes(searchLower) || 
          tutor.subjects.some(subj => subj.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply subject filter
    if (subject !== "all" && subject) {
      result = result.filter(tutor => tutor.subjects.includes(subject));
    }
    
    // Apply language filter
    if (language !== "all" && language) {
      result = result.filter(tutor => tutor.languages.includes(language));
    }
    
    // Apply class type filter
    if (classType !== "all" && classType) {
      result = result.filter(tutor => tutor.classType.includes(classType));
    }
    
    // Apply availability filter
    if (availability !== "all" && availability) {
      result = result.filter(tutor => tutor.availability.includes(availability));
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch(sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "priceAsc":
          return parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''));
        case "priceDesc":
          return parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, ''));
        case "experience":
          return b.experience - a.experience;
        default:
          return 0;
      }
    });
    
    setFilteredTutors(result);
  }, [tutors, searchTerm, subject, language, classType, availability, sortBy]);

  const handleTutorClick = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="container-custom min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="container-custom py-12 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Find Your Perfect Tutor</h1>
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Search Tutors</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Search and Filters Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input 
                placeholder="Search by tutor name or subject" 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter Toggle Button (Mobile) */}
            <div className="md:hidden">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-between"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <span className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </span>
                {isFilterOpen ? <X size={16} /> : <Plus size={16} />}
              </Button>
            </div>
            
            {/* Filter Controls - Desktop always visible, Mobile toggleable */}
            <div className={`grid grid-cols-1 md:grid-cols-5 gap-4 ${isFilterOpen ? 'block' : 'hidden md:grid'}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating (Highest)</SelectItem>
                    <SelectItem value="priceAsc">Price (Low to High)</SelectItem>
                    <SelectItem value="priceDesc">Price (High to Low)</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subj => (
                      <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Languages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Type
                </label>
                <Select value={classType} onValueChange={setClassType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {classTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <Select value={availability} onValueChange={setAvailability}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Time</SelectItem>
                    {availabilityOptions.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Active Filters */}
            {(subject !== "all" || language !== "all" || classType !== "all" || availability !== "all") && (
              <div className="flex flex-wrap gap-2 mt-2">
                {subject !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Subject: {subject}
                    <X 
                      size={14} 
                      className="cursor-pointer" 
                      onClick={() => setSubject("all")} 
                    />
                  </Badge>
                )}
                {language !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Language: {language}
                    <X 
                      size={14} 
                      className="cursor-pointer" 
                      onClick={() => setLanguage("all")} 
                    />
                  </Badge>
                )}
                {classType !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Class Type: {classType}
                    <X 
                      size={14} 
                      className="cursor-pointer" 
                      onClick={() => setClassType("all")} 
                    />
                  </Badge>
                )}
                {availability !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Availability: {availability}
                    <X 
                      size={14} 
                      className="cursor-pointer" 
                      onClick={() => setAvailability("all")} 
                    />
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSubject("all");
                    setLanguage("all");
                    setClassType("all");
                    setAvailability("all");
                  }}
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mb-4 text-gray-600">
          Showing {filteredTutors.length} {filteredTutors.length === 1 ? 'tutor' : 'tutors'}
        </div>
        
        {/* Tutor Grid */}
        {filteredTutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredTutors.map((tutor) => (
              <Card 
                key={tutor.id} 
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleTutorClick(tutor)}
              >
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={tutor.image} 
                        alt={tutor.name} 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{tutor.name}</h3>
                        <div className="text-sm text-gray-600">
                          {tutor.subjects.join(", ")}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{tutor.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tutor.languages.map(lang => (
                        <Badge key={lang} variant="outline" className="bg-blue-50">{lang}</Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="fill-amber-500" size={16} />
                        <span className="font-medium">{tutor.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
{/*                             <span className="font-semibold">{tutor.price}/hr</span> */}
                      </div>
                    </div>
                    
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg mb-8">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No verified tutors found</h3>
            <p className="text-gray-600 mb-6">
              Try changing your search criteria or check back later as more tutors get verified
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSubject("all");
                setLanguage("all");
                setClassType("all");
                setAvailability("all");
                setSortBy("rating");
              }}
            >
              Reset All Filters
            </Button>
          </div>
        )}
        
        {/* CTA Section */}
        <div className="text-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Go to Dashboard
              </Button>
            </Link>
        </div>
      </div>
      
      {/* Tutor Modal */}
      {selectedTutor && (
        <TutorModal
          tutor={selectedTutor}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
};

export default SearchPage;

