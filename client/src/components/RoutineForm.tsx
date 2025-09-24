import React, { useState, useEffect } from 'react';
import { routinesAPI } from '../services/api';
import { Routine } from '../types';

interface RoutineFormProps {
  routine?: Routine;
  onSubmit: (routine: Partial<Routine>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const RoutineForm: React.FC<RoutineFormProps> = ({ routine, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'breathwork' as 'breathwork' | 'meditation' | 'exercise' | 'stretching' | 'mindfulness' | 'sleep' | 'energy',
    metadata: {
      context: 'anytime' as 'morning' | 'evening' | 'anytime',
      energy: 'medium' as 'low' | 'medium' | 'high',
      duration: '15min' as '5min' | '15min' | '30min' | '60min',
      difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
      equipment: [] as string[],
      tags: [] as string[]
    },
    instructions: {
      steps: [{ step: 1, title: '', description: '', duration: undefined, imageUrl: undefined }] as Array<{
        step: number;
        title: string;
        description: string;
        duration?: string;
        imageUrl?: string;
      }>,
      tips: [] as string[],
      contraindications: [] as string[]
    }
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newEquipment, setNewEquipment] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newTip, setNewTip] = useState('');
  const [newContraindication, setNewContraindication] = useState('');

  useEffect(() => {
    if (routine) {
      setFormData({
        title: routine.title,
        description: routine.description,
        imageUrl: routine.imageUrl,
        category: routine.category,
        metadata: routine.metadata,
        instructions: routine.instructions
      });
      setImagePreview(routine.imageUrl);
    }
  }, [routine]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await routinesAPI.uploadImage(formData);
      setFormData(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
      setImageFile(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      instructions: {
        ...prev.instructions,
        steps: [...prev.instructions.steps, { 
          step: prev.instructions.steps.length + 1, 
          title: '', 
          description: '', 
          duration: undefined, 
          imageUrl: undefined 
        }]
      }
    }));
  };

  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: {
        ...prev.instructions,
        steps: prev.instructions.steps.filter((_, i) => i !== index)
      }
    }));
  };

  const updateStep = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: {
        ...prev.instructions,
        steps: prev.instructions.steps.map((step, i) => 
          i === index ? { ...step, [field]: value } : step
        )
      }
    }));
  };

  const addEquipment = () => {
    if (newEquipment.trim()) {
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          equipment: [...prev.metadata.equipment, newEquipment.trim()]
        }
      }));
      setNewEquipment('');
    }
  };

  const removeEquipment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        equipment: prev.metadata.equipment.filter((_, i) => i !== index)
      }
    }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          tags: [...prev.metadata.tags, newTag.trim()]
        }
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        tags: prev.metadata.tags.filter((_, i) => i !== index)
      }
    }));
  };

  const addTip = () => {
    if (newTip.trim()) {
      setFormData(prev => ({
        ...prev,
        instructions: {
          ...prev.instructions,
          tips: [...prev.instructions.tips, newTip.trim()]
        }
      }));
      setNewTip('');
    }
  };

  const removeTip = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: {
        ...prev.instructions,
        tips: prev.instructions.tips.filter((_, i) => i !== index)
      }
    }));
  };

  const addContraindication = () => {
    if (newContraindication.trim()) {
      setFormData(prev => ({
        ...prev,
        instructions: {
          ...prev.instructions,
          contraindications: [...prev.instructions.contraindications, newContraindication.trim()]
        }
      }));
      setNewContraindication('');
    }
  };

  const removeContraindication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: {
        ...prev.instructions,
        contraindications: prev.instructions.contraindications.filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Routine Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Morning Breathwork"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="breathwork">Breathwork</option>
                <option value="meditation">Meditation</option>
                <option value="exercise">Exercise</option>
                <option value="stretching">Stretching</option>
                <option value="mindfulness">Mindfulness</option>
                <option value="sleep">Sleep</option>
                <option value="energy">Energy</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Brief description of the routine..."
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Routine Image</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}

            {imageFile && (
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={uploadingImage}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {uploadingImage ? 'Uploading...' : 'Upload Image'}
              </button>
            )}

            {formData.imageUrl && (
              <div className="text-sm text-gray-600">
                Current image: {formData.imageUrl}
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Routine Metadata</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
                Context *
              </label>
              <select
                id="context"
                name="metadata.context"
                value={formData.metadata.context}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
                <option value="anytime">Anytime</option>
              </select>
            </div>

            <div>
              <label htmlFor="energy" className="block text-sm font-medium text-gray-700 mb-2">
                Energy Level *
              </label>
              <select
                id="energy"
                name="metadata.energy"
                value={formData.metadata.energy}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <select
                id="duration"
                name="metadata.duration"
                value={formData.metadata.duration}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="5min">5 minutes</option>
                <option value="15min">15 minutes</option>
                <option value="30min">30 minutes</option>
                <option value="60min">60 minutes</option>
              </select>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty *
              </label>
              <select
                id="difficulty"
                name="metadata.difficulty"
                value={formData.metadata.difficulty}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Equipment */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipment
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                placeholder="Add equipment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={addEquipment}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.metadata.equipment.map((equipment, index) => (
                <span
                  key={index}
                  className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {equipment}
                  <button
                    type="button"
                    onClick={() => removeEquipment(index)}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.metadata.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-wellness-100 text-wellness-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-wellness-600 hover:text-wellness-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
          
          {/* Steps */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Steps
              </label>
              <button
                type="button"
                onClick={addStep}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                Add Step
              </button>
            </div>
            
            {formData.instructions.steps.map((step, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Step {step.step}</h4>
                  {formData.instructions.steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Step Title
                    </label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => updateStep(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Preparation"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (optional)
                    </label>
                    <input
                      type="text"
                      value={step.duration}
                      onChange={(e) => updateStep(index, 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 2 minutes"
                    />
                  </div>
                </div>
                
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={step.description}
                    onChange={(e) => updateStep(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Detailed instructions for this step..."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tips
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTip}
                onChange={(e) => setNewTip(e.target.value)}
                placeholder="Add a helpful tip..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={addTip}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.instructions.tips.map((tip, index) => (
                <div key={index} className="flex items-center gap-2 bg-yellow-50 p-3 rounded-lg">
                  <span className="text-yellow-600">💡</span>
                  <span className="flex-1 text-sm">{tip}</span>
                  <button
                    type="button"
                    onClick={() => removeTip(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Contraindications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraindications
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newContraindication}
                onChange={(e) => setNewContraindication(e.target.value)}
                placeholder="Add contraindication..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={addContraindication}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.instructions.contraindications.map((contraindication, index) => (
                <div key={index} className="flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                  <span className="text-red-600">⚠️</span>
                  <span className="flex-1 text-sm">{contraindication}</span>
                  <button
                    type="button"
                    onClick={() => removeContraindication(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : routine ? 'Update Routine' : 'Create Routine'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoutineForm;
