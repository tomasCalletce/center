import { TestUploadForm } from "./_components/test-upload-form";
import { TestNav } from "./_components/test-nav";

export default function TestUploadFeaturePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <TestNav />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CV Processing & Profile Display
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your CV to extract professional information and view your structured profile. 
            The system will process your document and display the results in an organized format.
          </p>
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-sm text-yellow-800">
            <strong>Test Mode:</strong> Using hardcoded user ID: user_2yQg3DsQZGcYB1ZiBedp0miD0pT
          </div>
        </div>
        
        <TestUploadForm />
      </div>
    </div>
  );
} 