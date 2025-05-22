import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCourseById, updateCourse, resetUpdateCourseSuccess } from '../../store/slices/Courses/coursesSlice';
import { FaArrowLeft, FaPlus, FaMinus, FaUpload, FaInfoCircle, FaSave } from 'react-icons/fa';

const EditCourse = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    selectedCourse, 
    singleCourseLoading, 
    singleCourseError,
    updateCourseLoading, 
    updateCourseError, 
    updateCourseSuccess 
  } = useSelector((state) => state.courses);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    longDescription: '',
    category: '',
    status: 'active',
    features: [{ icon: '', text: '' }],
    badge: '',
    price: '',
    discountPrice: '',
    isFree: false,
    thumbnailUrl: '',
    image: '',
    instructor: {
      name: '',
      title: '',
      bio: '',
      image: ''
    },
    whatYouWillLearn: [''],
    courseContent: [{
      title: '',
      lessons: [{
        title: '',
        duration: '',
        preview: false
      }]
    }],
    requirements: [''],
    targetAudience: ['']
  });

  // Fetch course data when component mounts
  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(courseId));
    }
  }, [dispatch, courseId]);

  // Populate form with course data when it's loaded
  useEffect(() => {
    if (selectedCourse) {
      setFormData({
        title: selectedCourse.title || '',
        subtitle: selectedCourse.subtitle || '',
        description: selectedCourse.description || '',
        longDescription: selectedCourse.longDescription || '',
        category: selectedCourse.category || '',
        status: selectedCourse.status || 'active',
        features: selectedCourse.features?.length > 0 ? selectedCourse.features : [{ icon: '', text: '' }],
        badge: selectedCourse.badge || '',
        price: selectedCourse.price || '',
        discountPrice: selectedCourse.discountPrice || '',
        isFree: selectedCourse.isFree || false,
        thumbnailUrl: selectedCourse.thumbnailUrl || '',
        image: selectedCourse.image || '',
        instructor: selectedCourse.instructor || {
          name: '',
          title: '',
          bio: '',
          image: ''
        },
        whatYouWillLearn: selectedCourse.whatYouWillLearn?.length > 0 ? selectedCourse.whatYouWillLearn : [''],
        courseContent: selectedCourse.courseContent?.length > 0 ? selectedCourse.courseContent : [{
          title: '',
          lessons: [{
            title: '',
            duration: '',
            preview: false
          }]
        }],
        requirements: selectedCourse.requirements?.length > 0 ? selectedCourse.requirements : [''],
        targetAudience: selectedCourse.targetAudience?.length > 0 ? selectedCourse.targetAudience : ['']
      });
    }
  }, [selectedCourse]);

  // Handle form submission success
  useEffect(() => {
    if (updateCourseSuccess) {
      alert('Course updated successfully!');
      dispatch(resetUpdateCourseSuccess());
      navigate(`/course/${courseId}`);
    }
  }, [updateCourseSuccess, dispatch, navigate, courseId]);

  // Handle input change for basic fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle instructor fields
  const handleInstructorChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      instructor: {
        ...prev.instructor,
        [name]: value
      }
    }));
  };

  // Handle array fields (whatYouWillLearn, requirements, targetAudience)
  const handleArrayFieldChange = (index, field, value) => {
    setFormData(prev => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return {
        ...prev,
        [field]: updatedArray
      };
    });
  };

  // Add new item to array fields
  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  // Remove item from array fields
  const removeArrayItem = (field, index) => {
    setFormData(prev => {
      const updatedArray = [...prev[field]];
      updatedArray.splice(index, 1);
      return {
        ...prev,
        [field]: updatedArray
      };
    });
  };

  // Handle features change
  const handleFeatureChange = (index, key, value) => {
    setFormData(prev => {
      const updatedFeatures = [...prev.features];
      updatedFeatures[index] = {
        ...updatedFeatures[index],
        [key]: value
      };
      return {
        ...prev,
        features: updatedFeatures
      };
    });
  };

  // Add new feature
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { icon: '', text: '' }]
    }));
  };

  // Remove feature
  const removeFeature = (index) => {
    setFormData(prev => {
      const updatedFeatures = [...prev.features];
      updatedFeatures.splice(index, 1);
      return {
        ...prev,
        features: updatedFeatures
      };
    });
  };

  // Handle course content change
  const handleContentChange = (sectionIndex, key, value) => {
    setFormData(prev => {
      const updatedContent = [...prev.courseContent];
      updatedContent[sectionIndex] = {
        ...updatedContent[sectionIndex],
        [key]: value
      };
      return {
        ...prev,
        courseContent: updatedContent
      };
    });
  };

  // Add new content section
  const addContentSection = () => {
    setFormData(prev => ({
      ...prev,
      courseContent: [
        ...prev.courseContent,
        {
          title: '',
          lessons: [{
            title: '',
            duration: '',
            preview: false
          }]
        }
      ]
    }));
  };

  // Remove content section
  const removeContentSection = (sectionIndex) => {
    setFormData(prev => {
      const updatedContent = [...prev.courseContent];
      updatedContent.splice(sectionIndex, 1);
      return {
        ...prev,
        courseContent: updatedContent
      };
    });
  };

  // Handle lesson change
  const handleLessonChange = (sectionIndex, lessonIndex, key, value) => {
    setFormData(prev => {
      const updatedContent = [...prev.courseContent];
      const updatedLessons = [...updatedContent[sectionIndex].lessons];
      
      updatedLessons[lessonIndex] = {
        ...updatedLessons[lessonIndex],
        [key]: key === 'preview' ? value : value
      };
      
      updatedContent[sectionIndex] = {
        ...updatedContent[sectionIndex],
        lessons: updatedLessons
      };
      
      return {
        ...prev,
        courseContent: updatedContent
      };
    });
  };

  // Add new lesson to a section
  const addLesson = (sectionIndex) => {
    setFormData(prev => {
      const updatedContent = [...prev.courseContent];
      updatedContent[sectionIndex] = {
        ...updatedContent[sectionIndex],
        lessons: [
          ...updatedContent[sectionIndex].lessons,
          {
            title: '',
            duration: '',
            preview: false
          }
        ]
      };
      return {
        ...prev,
        courseContent: updatedContent
      };
    });
  };

  // Remove lesson from a section
  const removeLesson = (sectionIndex, lessonIndex) => {
    setFormData(prev => {
      const updatedContent = [...prev.courseContent];
      const updatedLessons = [...updatedContent[sectionIndex].lessons];
      updatedLessons.splice(lessonIndex, 1);
      
      updatedContent[sectionIndex] = {
        ...updatedContent[sectionIndex],
        lessons: updatedLessons
      };
      
      return {
        ...prev,
        courseContent: updatedContent
      };
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert price and discountPrice to numbers
    const courseData = {
      ...formData,
      price: formData.isFree ? 0 : Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined
    };
    
    dispatch(updateCourse({ courseId, courseData }));
  };

  if (singleCourseLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  if (singleCourseError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-red-900/30 border border-red-400 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {singleCourseError}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(`/course/${courseId}`)}
              className="bg-slate-800/50 text-white p-3 rounded-full hover:bg-purple-700/50 transition-all duration-300"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Edit Course
              </h1>
              <p className="text-gray-300 mt-2">Update the course details</p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {updateCourseError && (
          <div className="bg-red-900/30 border border-red-400 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm mb-6" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {updateCourseError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-purple-500/30 pb-2">Basic Information</h2>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Title <span className="text-red-400">*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Subtitle */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Badge */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Badge</label>
              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., New, Popular, Featured"
              />
            </div>

            {/* Price */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Price <span className="text-red-400">*</span></label>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFree"
                    checked={formData.isFree}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="text-gray-300">Free Course</label>
                </div>
                {!formData.isFree && (
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required={!formData.isFree}
                    min="0"
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                )}
              </div>
            </div>

            {/* Discount Price */}
            {!formData.isFree && (
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Discount Price</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  min="0"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

            {/* Description */}
            <div className="md:col-span-2 mb-4">
              <label className="block text-gray-300 mb-2">Short Description <span className="text-red-400">*</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              ></textarea>
            </div>

            {/* Long Description */}
            <div className="md:col-span-2 mb-4">
              <label className="block text-gray-300 mb-2">Long Description</label>
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                rows="6"
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              ></textarea>
            </div>

            {/* Thumbnail URL */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Thumbnail URL</label>
              <input
                type="text"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Image URL */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Instructor Information */}
            <div className="md:col-span-2 mt-6">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-purple-500/30 pb-2">Instructor Information</h2>
            </div>

            {/* Instructor Name */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Instructor Name</label>
              <input
                type="text"
                name="name"
                value={formData.instructor.name}
                onChange={handleInstructorChange}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Instructor Title */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Instructor Title</label>
              <input
                type="text"
                name="title"
                value={formData.instructor.title}
                onChange={handleInstructorChange}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Instructor Bio */}
            <div className="md:col-span-2 mb-4">
              <label className="block text-gray-300 mb-2">Instructor Bio</label>
              <textarea
                name="bio"
                value={formData.instructor.bio}
                onChange={handleInstructorChange}
                rows="3"
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              ></textarea>
            </div>

            {/* Instructor Image */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Instructor Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.instructor.image}
                onChange={handleInstructorChange}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Course Features */}
            <div className="md:col-span-2 mt-6">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-purple-500/30 pb-2">Course Features</h2>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4 mb-4">
                  <input
                    type="text"
                    value={feature.icon}
                    onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                    placeholder="Icon name (e.g., FaBook)"
                    className="w-1/3 bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    value={feature.text}
                    onChange={(e) => handleFeatureChange(index, 'text', e.target.value)}
                    placeholder="Feature description"
                    className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="bg-red-500/20 hover:bg-red-500/40 text-red-300 p-3 rounded-lg transition-colors duration-300"
                    disabled={formData.features.length <= 1}
                  >
                    <FaMinus />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300 mt-2"
              >
                <FaPlus /> Add Feature
              </button>
            </div>

            {/* What You Will Learn */}
            <div className="md:col-span-2 mt-6">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-purple-500/30 pb-2">What You Will Learn</h2>
              {formData.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex items-center gap-4 mb-4">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayFieldChange(index, 'whatYouWillLearn', e.target.value)}
                    placeholder="Learning outcome"
                    className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button 
                  type="button"
                    onClick={() => removeArrayItem('whatYouWillLearn', index)}
                    className="bg-red-500/20 hover:bg-red-500/40 text-red-300 p-3 rounded-lg transition-colors duration-300"
                    disabled={formData.whatYouWillLearn.length <= 1}
                  >
                    <FaMinus />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('whatYouWillLearn')}
                className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300 mt-2"
              >
                <FaPlus /> Add Learning Outcome
              </button>
            </div>

            {/* Course Content */}
            <div className="md:col-span-2 mt-6">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-purple-500/30 pb-2">Course Content</h2>
              {formData.courseContent.map((section, sectionIndex) => (
                <div key={sectionIndex} className="bg-slate-900/30 border border-white/10 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => handleContentChange(sectionIndex, 'title', e.target.value)}
                      placeholder="Section title"
                      className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeContentSection(sectionIndex)}
                      className="bg-red-500/20 hover:bg-red-500/40 text-red-300 p-3 rounded-lg transition-colors duration-300"
                      disabled={formData.courseContent.length <= 1}
                    >
                      <FaMinus />
                    </button>
                  </div>

                  {/* Lessons */}
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-300 mb-3">Lessons</h4>
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="flex items-center gap-4 mb-3">
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'title', e.target.value)}
                          placeholder="Lesson title"
                          className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="text"
                          value={lesson.duration}
                          onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'duration', e.target.value)}
                          placeholder="Duration (e.g., 10:30)"
                          className="w-32 bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={lesson.preview}
                            onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'preview', e.target.checked)}
                            className="mr-2 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label className="text-gray-300 text-sm">Preview</label>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLesson(sectionIndex, lessonIndex)}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-300 p-3 rounded-lg transition-colors duration-300"
                          disabled={section.lessons.length <= 1}
                        >
                          <FaMinus />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addLesson(sectionIndex)}
                      className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300 mt-2"
                    >
                      <FaPlus /> Add Lesson
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addContentSection}
                className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300 mt-2"
              >
                <FaPlus /> Add Section
              </button>
            </div>

            {/* Requirements */}
            <div className="md:col-span-2 mt-6">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-purple-500/30 pb-2">Requirements</h2>
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center gap-4 mb-4">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleArrayFieldChange(index, 'requirements', e.target.value)}
                    placeholder="Course requirement"
                    className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('requirements', index)}
                    className="bg-red-500/20 hover:bg-red-500/40 text-red-300 p-3 rounded-lg transition-colors duration-300"
                    disabled={formData.requirements.length <= 1}
                  >
                    <FaMinus />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('requirements')}
                className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300 mt-2"
              >
                <FaPlus /> Add Requirement
              </button>
            </div>

            {/* Target Audience */}
            <div className="md:col-span-2 mt-6">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-purple-500/30 pb-2">Target Audience</h2>
              {formData.targetAudience.map((audience, index) => (
                <div key={index} className="flex items-center gap-4 mb-4">
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => handleArrayFieldChange(index, 'targetAudience', e.target.value)}
                    placeholder="Target audience description"
                    className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('targetAudience', index)}
                    className="bg-red-500/20 hover:bg-red-500/40 text-red-300 p-3 rounded-lg transition-colors duration-300"
                    disabled={formData.targetAudience.length <= 1}
                  >
                    <FaMinus />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('targetAudience')}
                className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300 mt-2"
              >
                <FaPlus /> Add Target Audience
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-purple-500/30">
            <button
              type="button"
              onClick={() => navigate(`/course/${courseId}`)}
              className="bg-slate-600/50 hover:bg-slate-600/70 text-white px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateCourseLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateCourseLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaSave /> Update Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;