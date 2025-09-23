import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Clock, Building2, Briefcase, Star, ArrowRight } from "lucide-react";
import { Button } from "./components/ui/Button";
import { Badge } from "./components/ui/badge";
import { Card, CardContent } from "./components/ui/card";
import { getOffreById } from "./services/offreservice"

export default function JobOfferPage() {
  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOffreById(3)
      .then(data => setOffre(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Retour aux offres</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
          <div key={offre.id} className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            {/* Job Title Section */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{offre.titre}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span>{offre.company.nom_entreprise}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{offre.localisation}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>2-4 ans</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Publié le {new Date(offre.datePublication).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700">
                  Postuler
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline">
                  <Star className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </div>

            {/* Tech Stack Tags */}
            <div className="flex gap-2 flex-wrap">
              {offre.competencesRequises &&
                JSON.parse(offre.competencesRequises).map((tech, i) => (
                  <Badge key={i} variant="secondary">{tech}</Badge>
                ))
              }
            </div>

            {/* Job Description */}
            <Card className="mb-6 mt-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" /> Description du poste
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>{offre.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
         <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Intéressé(e) ?</h3>
            <p className="text-gray-600 mb-6">Postulez dès maintenant pour cette opportunité</p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Postuler maintenant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux offres
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
